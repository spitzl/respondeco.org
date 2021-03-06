package org.respondeco.respondeco.repository;

import org.respondeco.respondeco.domain.Organization;
import org.respondeco.respondeco.domain.Posting;
import org.respondeco.respondeco.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring Data JPA repository for the Posting entity.
 */
public interface PostingRepository extends JpaRepository<Posting, Long>{

        /**
         * method to find posting from the repository by given id and active is true
         * @param postingId the given posting id
         * @return the posting with the given id and active is true
         */
    public Posting findByIdAndActiveIsTrue(Long postingId);
}
